package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {


    private static final HttpClient client = HttpClient.newHttpClient();
    private final String apiKey = System.getenv("EMAIL_API_KEY");
    private final String fromEmail = System.getenv("FROM_EMAIL");

    private final JwtService jwtService;

    public EmailService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public ResponseEntity<ApiResponse> sendVerificationEmail(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);

        String token = jwtService.generateToken("verificationToken", claims, 600);
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        String url = "http://localhost:8080/api/email/verify/";
        String link = url + encodedToken;

        try {
            String html = """
                    <p>Verification Email:</p>
                    <a href="%s">Click here to verify</a>
                    """.formatted(link);

            String json = createBody(html, email);

            sendEmail(json);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok().body(new ApiResponse("Verification link sent"));
    }


    public ResponseEntity<ApiResponse> sendVerificationCode(String email, String code){

        String html = """
                <p>Verification code: </p>
                <p>%s</p>
                """.formatted(code);


     String json = createBody(html, email);
     sendEmail(json);



     return ResponseEntity.ok().body(new ApiResponse("Verification code sent"));

    }

    private void sendEmail(String json) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.smtp2go.com/v3/email/send"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();
            client.send(request, HttpResponse.BodyHandlers.ofString());


        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String createBody(String html, String email){
        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> body = new HashMap<>();
        body.put("api_key", apiKey);
        body.put("to", new String[]{email});
        body.put("sender", fromEmail);
        body.put("subject", "Verify your email");
        body.put("html_body", html);

        return mapper.writeValueAsString(body);
    }
}
