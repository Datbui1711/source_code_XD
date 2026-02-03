package com.careermate.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Value("${jwt.secret:your-secret-key-change-this-in-production-minimum-256-bits-required-for-hs256}")
    private String jwtSecret;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            System.out.println("AuthenticationFilter called for: " + exchange.getRequest().getPath());
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            System.out.println("Authorization header: " + authHeader);
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    Claims claims = Jwts.parser()
                            .setSigningKey(jwtSecret)
                            .parseClaimsJws(token)
                            .getBody();
                    
                    String email = claims.getSubject();
                    String role = claims.get("role", String.class);
                    System.out.println("Extracted email from JWT: " + email);
                    System.out.println("Extracted role from JWT: " + role);
                    
                    // Add email and role to request headers
                    exchange = exchange.mutate()
                            .request(r -> r.header("X-User-Email", email)
                                          .header("X-User-Role", role))
                            .build();
                } catch (Exception e) {
                    System.err.println("Failed to parse JWT: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("No Authorization header or invalid format");
            }
            
            return chain.filter(exchange);
        };
    }

    public static class Config {
        // Configuration properties if needed
    }
}
