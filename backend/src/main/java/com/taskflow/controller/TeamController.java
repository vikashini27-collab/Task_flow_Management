package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.entity.TeamInvite;
import com.taskflow.entity.User;
import com.taskflow.repository.TeamInviteRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/team")
public class TeamController {

    private final TeamInviteRepository teamInviteRepository;
    private final UserRepository userRepository;

    public TeamController(TeamInviteRepository teamInviteRepository, UserRepository userRepository) {
        this.teamInviteRepository = teamInviteRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/invite")
    public ResponseEntity<ApiResponse<TeamInvite>> createInvite(@RequestBody Map<String, String> body, @AuthenticationPrincipal User user) {
        TeamInvite invite = new TeamInvite();
        invite.setTeamName(body.getOrDefault("teamName", "My Team"));
        invite.setInviteCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        invite.setCreator(user);
        teamInviteRepository.save(invite);
        return ResponseEntity.ok(new ApiResponse<TeamInvite>(true, "Invite created", invite));
    }

    @GetMapping("/invites")
    public ResponseEntity<ApiResponse<List<TeamInvite>>> getMyInvites(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new ApiResponse<List<TeamInvite>>(true, "Invites fetched", teamInviteRepository.findByCreatorId(user.getId())));
    }

    @PostMapping("/join")
    public ResponseEntity<ApiResponse<String>> joinTeam(@RequestBody Map<String, String> body) {
        var invite = teamInviteRepository.findByInviteCode(body.get("code"));
        if (invite.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<String>(true, "Joined team: " + invite.get().getTeamName(), invite.get().getTeamName()));
        }
        return ResponseEntity.badRequest().body(new ApiResponse<String>(false, "Invalid invite code", null));
    }
}
