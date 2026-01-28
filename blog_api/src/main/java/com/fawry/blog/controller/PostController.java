package com.fawry.blog.controller;

import com.fawry.blog.dto.Response;
import com.fawry.blog.dto.post.CommentResponse;
import com.fawry.blog.dto.post.PostRequest;
import com.fawry.blog.dto.post.PostResponse;
import com.fawry.blog.dto.post.PutRequest;
import com.fawry.blog.entity.Reaction;
import com.fawry.blog.service.PostService;
import com.fawry.blog.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final UserService userService;
    private final RestClient restClient;
    static Long temp;

    public PostController(PostService postService, UserService userService, RestClient.Builder restClientBuilder) {
        this.postService = postService;
        this.userService = userService;
        this.restClient = restClientBuilder.build();
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest request) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Long id = userService.getUserByUsername(name).id();
        return ResponseEntity.ok(postService.createPost(request, id));
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Post deleted successfully.");
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long id, @Valid @RequestBody PutRequest newPost) {
        return ResponseEntity.ok(postService.updatePost(id, newPost));
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/comment")
    public ResponseEntity<Response<String>> addComment(
            @RequestBody CommentResponse comment) {

        System.out.println(comment.postId()+comment.username()+comment.content());
        postService.addComment(comment.postId(), comment.username(), comment.content());

        Response<String> response = new Response<>("Comment added successfully", null);
        return ResponseEntity.ok(response);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/{postId}/comments")
    public ResponseEntity<Response<List<CommentResponse>>> getComments(
            @PathVariable Long postId
    ){
        Response<List<CommentResponse>> response = new Response<>("success", postService.getCommentsByPostId(postId));
        return ResponseEntity.ok(response);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/{postId}/{username}/react/{isLike}")
    public ResponseEntity<Response<String>> react(
            @PathVariable Long postId,
            @PathVariable String username,
            @PathVariable boolean isLike) {

        postService.processReaction(postId, username, isLike);

        Response<String> response = new Response<>("Reaction recorded successfully.", null);

        return ResponseEntity.ok(response);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/stats/{postId}")
    public ResponseEntity<Map<String, Object>> getPostStats(@PathVariable Long postId) {
        Map<String, Object> stats = postService.getPostInteractionStats(postId);

        return ResponseEntity.ok(stats);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/reaction/{postId}/{userId}")
    public ResponseEntity<Response<Optional<Reaction>>> getPostReaction(@PathVariable Long postId, @PathVariable Long userId) {
        Optional<Reaction> reaction = postService.getReactionByUserId(userId, postId);
        Response<Optional<Reaction>> response = new Response<Optional<Reaction>>("Reaction retrieved successfully.", reaction);
        return ResponseEntity.ok(response);
    }



    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/tweet/{postId}")
    public void tweetPostId(
            @PathVariable Long postId){
        temp = postId;
        System.out.println(1);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/retweet")
    public String postTweet(
            @RegisteredOAuth2AuthorizedClient("twitter") OAuth2AuthorizedClient client
    ) {

        System.out.println(temp);
        String accessToken = client.getAccessToken().getTokenValue();
        String tweetText = postService.getPostById(temp).toString();

        try {
            return restClient.post()
                    .uri("https://api.twitter.com/2/tweets")
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("text", tweetText)) // Twitter expects a JSON object with a 'text' field
                    .retrieve()
                    .body(String.class);
        } catch (Exception e) {
            return "Failed to post tweet: " + e.getMessage();
        }
    }
}