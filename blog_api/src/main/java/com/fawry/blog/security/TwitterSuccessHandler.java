package com.fawry.blog.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import java.io.IOException;
import java.util.Map;

public class TwitterSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        response.setContentType("text/html");
        response.getWriter().write("""
        <html>
            <body>
                <script>
                    // Send a message to the window that opened this popup
                    window.opener.postMessage({ status: 'success' }, 'http://127.0.0.1:4200');
                    // Close this popup
                    window.close();
                </script>
            </body>
        </html>
    """);
    }
}