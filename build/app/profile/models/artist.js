var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import Profile from './profile.js';
export default class Artist extends BaseModel {
    static async createUUID(artist) {
        artist.id = uuid();
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], Artist.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Artist.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Artist.prototype, "popularity", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Artist.prototype, "followers", void 0);
__decorate([
    column({ serializeAs: 'spotifyUri' }),
    __metadata("design:type", String)
], Artist.prototype, "spotifyUri", void 0);
__decorate([
    column({ serializeAs: 'spotifyImage' }),
    __metadata("design:type", String)
], Artist.prototype, "spotifyImage", void 0);
__decorate([
    column({ serializeAs: 'spotifyId' }),
    __metadata("design:type", String)
], Artist.prototype, "spotifyId", void 0);
__decorate([
    column.dateTime({ autoCreate: true, serializeAs: 'createdAt' }),
    __metadata("design:type", DateTime)
], Artist.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' }),
    __metadata("design:type", Object)
], Artist.prototype, "updatedAt", void 0);
__decorate([
    column({ serializeAs: 'profileId' }),
    __metadata("design:type", Object)
], Artist.prototype, "profileId", void 0);
__decorate([
    belongsTo(() => Profile),
    __metadata("design:type", Object)
], Artist.prototype, "profile", void 0);
__decorate([
    beforeCreate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], Artist, "createUUID", null);
//# sourceMappingURL=artist.js.map