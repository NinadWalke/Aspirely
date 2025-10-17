import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    getAuthData() {
        return {userId: 1, username: "walky_117"}
    }
}
