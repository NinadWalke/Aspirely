import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotesDto, UpdateNotesDto } from './dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}
  async createANewNote(userId: string, dto: NotesDto) {
    // we convert tags from string to an array of tags
    const parsedtags = dto.tags
      ? dto.tags.split(',').map((tag) => tag.trim())
      : [];
    const correctedDto = {
      ...dto,
      tags: parsedtags,
    };
    const createdNote = await this.prisma.note.create({
      data: {
        userId: userId,
        ...correctedDto,
      },
    });
    return createdNote;
  }
  async getAllPresentNotes(userId: string) {
    const currNotes = await this.prisma.note.findMany({
      where: { userId: userId },
    });
    return currNotes;
  }
  async getASpecificNoteAndDetails(noteId: string) {
    const currNote = await this.prisma.note.findUnique({
      where: { id: noteId },
    });
    return currNote;
  }
  async updateASpecificNote(noteId: string, dto: UpdateNotesDto) {
    const parsedtags = dto.tags
      ? dto.tags.split(',').map((tag) => tag.trim())
      : [];
    const correctedDto = {
      ...dto,
      tags: parsedtags,
    };
    const updatedNote = await this.prisma.note.update({
      where: { id: noteId },
      data: { ...correctedDto },
    });
    return updatedNote;
  }
  async deleteASpecificNote(noteId: string) {
    const deletedNote = await this.prisma.note.delete({
      where: { id: noteId },
    });
    return deletedNote;
  }
}
