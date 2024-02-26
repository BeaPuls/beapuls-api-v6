var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Profile from '#profile/models/profile';
import { inject } from '@adonisjs/fold';
let ProfileService = class ProfileService {
    async createUserProfile(user, avatarUrl) {
        const newProfile = Profile.updateOrCreate({
            userId: user.id,
        }, {
            userId: user.id,
            avatar: avatarUrl,
        });
        return newProfile;
    }
};
ProfileService = __decorate([
    inject()
], ProfileService);
export default ProfileService;
//# sourceMappingURL=profile.service.js.map