import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('notes')
export class NotesController {
    constructor(private notesService: NotesService) {}
    @Post()
    createANewNote() {}
    @Get()
    getAllPresentNotes() {}
    @Get(':id')
    getASpecificNoteAndDetails() {}
    @Put(':id')
    updateASpecificNote() {}
    @Delete(':id')
    deleteASpecificNote() {}
}
