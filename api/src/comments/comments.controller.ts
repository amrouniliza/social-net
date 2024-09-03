import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/interfaces';

@Controller()
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('posts/:postId/comments')
  create(@Req() req: AuthenticatedRequest, @Param('postId') postId: string, @Body() CreateCommentDto: CreateCommentDto) {
    return this.commentsService.create(
      req.user,
      postId,
      CreateCommentDto.content
    );
  }

  @Delete('comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('commentId') commentId: string) {
    return this.commentsService.remove(commentId);
  }
}
