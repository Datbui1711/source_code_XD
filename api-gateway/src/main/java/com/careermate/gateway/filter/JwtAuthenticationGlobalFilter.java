package com.careermate.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationGlobalFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret:your-secret-key-change-this-in-production-minimum-256-bits-required-for-hs256}")
    private String jwtSecret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        
        // Only apply to /api/jobs/** paths
        if (!path.startsWith("/api/jobs/")) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtSecret)
                        .parseClaimsJws(token)
                        .getBody();
                
                String email = claims.getSubject();
                System.out.println("JWT Filter - Extracted email: " + email);
                
                // Add email to request header
                ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                        .header("X-User-Email", email)
                        .build();
                
                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            } catch (Exception e) {
                System.err.println("JWT Filter - Failed to parse JWT: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("JWT Filter - No Authorization header for path: " + path);
        }
        
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -100; // Execute before other filters
    }
}
