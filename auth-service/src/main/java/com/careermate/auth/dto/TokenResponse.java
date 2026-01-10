package com.careermate.auth.dto;

public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private String role;
    private String email;

    public TokenResponse() {
    }

    public TokenResponse(String accessToken, String refreshToken, String tokenType, Long expiresIn, String role, String email) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.role = role;
        this.email = email;
    }

    public static TokenResponseBuilder builder() {
        return new TokenResponseBuilder();
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static class TokenResponseBuilder {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private Long expiresIn;
        private String role;
        private String email;

        public TokenResponseBuilder accessToken(String accessToken) {
            this.accessToken = accessToken;
            return this;
        }

        public TokenResponseBuilder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }

        public TokenResponseBuilder tokenType(String tokenType) {
            this.tokenType = tokenType;
            return this;
        }

        public TokenResponseBuilder expiresIn(Long expiresIn) {
            this.expiresIn = expiresIn;
            return this;
        }

        public TokenResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public TokenResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public TokenResponse build() {
            return new TokenResponse(accessToken, refreshToken, tokenType, expiresIn, role, email);
        }
    }
}
