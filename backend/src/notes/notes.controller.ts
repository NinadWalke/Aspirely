import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { NotesService } from './notes.service';

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
