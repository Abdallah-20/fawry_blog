package com.fawry.blog.service;

import com.fawry.blog.dto.post.*;
import com.fawry.blog.entity.Comment;
import com.fawry.blog.entity.Post;
import com.fawry.blog.entity.Reaction;
import com.fawry.blog.entity.User;
import com.fawry.blog.exception.ResourceNotFoundException; // Import your custom exception
import com.fawry.blog.repository.CommentRepository;
import com.fawry.blog.repository.PostRepository;
import com.fawry.blog.repository.ReactionRepository;
import com.fawry.blog.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository,
                       CommentRepository commentRepository, ReactionRepository reactionRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.reactionRepository = reactionRepository;
    }

    public PostResponse createPost(PostRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Post post = new Post();
        post.setTitle(request.title());
        post.setContent(request.content());
        post.setUser(user);

        Post savedPost = postRepository.save(post);
        return mapToResponse(savedPost);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByUserId(String username) {
        Long currentUserId = userRepository.findByUsername(username).get().getId();
        return postRepository.findByUserId(currentUserId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        return mapToResponse(post);
    }

    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete: Post not found with id: " + id);
        }
        postRepository.deleteById(id);
    }

    public PostResponse updatePost(Long id, PutRequest newPost) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        if (newPost.title() != null && !newPost.title().isBlank()) {
            post.setTitle(newPost.title());
        }

        if (newPost.content() != null && !newPost.content().isBlank()) {
            post.setContent(newPost.content());
        }

        return mapToResponse(postRepository.save(post));
    }

    public void addComment(Long postId, String username, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);

        commentRepository.save(comment);
    }

    public List<CommentResponse> getCommentsByPostId(Long postId){
        return commentRepository.findByPostId(postId).stream()
                .map(comment -> new CommentResponse(
                        comment.getUser().getUsername(), // Assumes User entity has getUsername()
                        comment.getPost().getId(),
                        comment.getContent()))
                .collect(Collectors.toList());
    }

    public void processReaction(Long postId, String username, boolean isLike) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Optional<Reaction> existingReaction = Optional.ofNullable(reactionRepository.findByUserIdAndPostId(user.getId(), postId));

        if (existingReaction.isPresent()) {
            Reaction reaction = existingReaction.get();
            reaction.setLike(isLike);
            reactionRepository.save(reaction);
        } else {
            Reaction newReaction = new Reaction();
            newReaction.setPost(post);
            newReaction.setUser(user);
            newReaction.setLike(isLike);
            reactionRepository.save(newReaction);
        }
    }

    public Optional<Reaction> getReactionByUserId(Long UserId, Long PostId){
        return Optional.ofNullable(reactionRepository.findByUserIdAndPostId(UserId, PostId));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPostInteractionStats(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id: " + postId);
        }

        long commentCount = commentRepository.countByPostId(postId);
        long likes = reactionRepository.countByPostIdAndIsLikeTrue(postId);
        long dislikes = reactionRepository.countByPostIdAndIsLikeFalse(postId);

        double totalReactions = likes + dislikes;
        double rating = (totalReactions == 0) ? 0 : (double) likes / totalReactions * 100;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalComments", commentCount);
        stats.put("totalLikes", likes);
        stats.put("totalDislikes", dislikes);
        stats.put("approvalRating", String.format("%.2f%%", rating));

        return stats;
    }

    private PostResponse mapToResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt(),
                post.getUser().getName(),
                post.getReactions().stream()
                        .map((reaction) -> new ReactionResponse(reaction.getLike(), reaction.getUser().getUsername())).toList()
        );
    }
}