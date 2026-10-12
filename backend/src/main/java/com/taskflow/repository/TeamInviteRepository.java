package com.taskflow.repository;

import com.taskflow.entity.TeamInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface TeamInviteRepository extends JpaRepository<TeamInvite, Long> {
    Optional<TeamInvite> findByInviteCode(String inviteCode);
    List<TeamInvite> findByCreatorId(Long creatorId);
}
