package com.careermate.candidate.service;

import com.careermate.candidate.dto.ProfileResponse;
import com.careermate.candidate.entity.Badge;
import com.careermate.candidate.entity.Profile;
import com.careermate.candidate.repository.BadgeRepository;
import com.careermate.candidate.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CandidateService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    public ProfileResponse getProfile(String email) {
        Profile profile = profileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return convertToResponse(profile);
    }

    public ProfileResponse createProfile(Profile profile) {
        Profile saved = profileRepository.save(profile);
        return convertToResponse(saved);
    }

    public ProfileResponse updateProfile(String email, Profile profileData) {
        Profile profile = profileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (profileData.getFullName() != null)
            profile.setFullName(profileData.getFullName());
        if (profileData.getPhone() != null)
            profile.setPhone(profileData.getPhone());
        if (profileData.getLocation() != null)
            profile.setLocation(profileData.getLocation());
        if (profileData.getSkills() != null)
            profile.setSkills(profileData.getSkills());
        if (profileData.getExperience() != null)
            profile.setExperience(profileData.getExperience());
        if (profileData.getEducation() != null)
            profile.setEducation(profileData.getEducation());

        Profile saved = profileRepository.save(profile);
        return convertToResponse(saved);
    }

    public List<Badge> getBadges(Long userId) {
        return badgeRepository.findByUserId(userId);
    }

    public Badge awardBadge(Long userId, String name, String icon) {
        Badge badge = new Badge();
        badge.setUserId(userId);
        badge.setName(name);
        badge.setIcon(icon);
        badge.setEarnedAt(LocalDateTime.now());
        return badgeRepository.save(badge);
    }

    private ProfileResponse convertToResponse(Profile profile) {
        ProfileResponse response = new ProfileResponse();
        response.setId(profile.getId());
        response.setFullName(profile.getFullName());
        response.setEmail(profile.getEmail());
        response.setPhone(profile.getPhone());
        response.setLocation(profile.getLocation());
        response.setSkills(profile.getSkills());
        response.setExperience(profile.getExperience());
        response.setEducation(profile.getEducation());
        response.setPoints(profile.getPoints());
        return response;
    }
}
