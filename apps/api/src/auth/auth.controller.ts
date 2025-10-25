import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    @Post("signup")
    registerUser(@Body() CreateUserDto: CreateUserDto){
      return this.authService.registerUser(CreateUserDto)
    } 

    @UseGuards(LocalAuthGuard)    
    @Post("login")
    login(@Request() req){
      return this.authService.login(req.user.id, req.user.name)
    }


    @UseGuards(JwtAuthGuard)
    @Get("protected")
    getAll(@Request() req){
      return {message: `Now you can access this protected API. This is your user ID: ${req.user.id}` }
    }


    @UseGuards(RefreshAuthGuard)
    @Post("refresh")
    refreshToken(@Request() req){
      return this.authService.refreshToken(req.user.id, req.user.name);
    }


    @UseGuards(GoogleAuthGuard)
    @Get("google/login")
    googleLogin(){}

    
    @UseGuards(GoogleAuthGuard)
    @Get("google/callback")
    googleCallback(){}

}
