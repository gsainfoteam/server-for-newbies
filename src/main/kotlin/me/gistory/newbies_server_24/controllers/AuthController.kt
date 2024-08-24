package me.gistory.newbies_server_24.controllers

import io.swagger.v3.oas.annotations.tags.Tag
import me.gistory.newbies_server_24.dto.LoginRequestDto
import me.gistory.newbies_server_24.dto.RegisterRequestDto
import me.gistory.newbies_server_24.dto.TokenResponseDto
import me.gistory.newbies_server_24.services.AuthService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "Auth")
@RestController
@RequestMapping("/auth")
class AuthController(private val authService: AuthService) {
    @PostMapping("/login")
    fun login(@RequestBody data: LoginRequestDto) = TokenResponseDto(authService.login(data))

    @PostMapping("/register")
    fun register(@RequestBody data: RegisterRequestDto) = TokenResponseDto(authService.register(data))
}