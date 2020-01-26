import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import 'dotenv/config';
import * as jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            algorithms: [process.env.AUTH_ALGORITHM || 'RS256'],
            audience: process.env.AUTH_AUDIENCE,
            issuer: process.env.AUTH_ISSUER,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${process.env.AUTH_ISSUER}.well-known/jwks.json`,
                rateLimit: true,
            }),
        });
    }

    public async validate(payload: any) {
        return { userId: payload.sub.split('|')[1] || payload.sub };
    }
}
