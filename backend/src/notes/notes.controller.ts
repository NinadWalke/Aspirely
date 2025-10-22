import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { NotesDto, UpdateNotesDto } from './dto';
import type { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('notes')
export class NotesController {
    constructor(private notesService: NotesService) {}
    @Post()
    createANewNote(@GetUser() user: User, @Body() dto: NotesDto) {
        const createdNote = this.notesService.createANewNote(user.id, dto);
        return createdNote;
    }
    @Get()
    getAllPresentNotes(@GetUser() user: User) {
        const currUserNotes = this.notesService.getAllPresentNotes(user.id);
        return currUserNotes;
    }
    @Get(':id')
    getASpecificNoteAndDetails(@Param('id') id: string) {
        const currNote = this.notesService.getASpecificNoteAndDetails(id);
        return currNote;
    }
    @Put(':id')
    updateASpecificNote(@Param('id') id: string, @Body() dto: UpdateNotesDto) {
        const updatedNote = this.notesService.updateASpecificNote(id, dto);
        return updatedNote;
    }
    @Delete(':id')
    deleteASpecificNote(@Param('id') id: string) {
        const deletedNote = this.notesService.deleteASpecificNote(id);
        return deletedNote;
    }
}
