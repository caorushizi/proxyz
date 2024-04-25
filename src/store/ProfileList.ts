import { makeAutoObservable } from "mobx";
import { Profile } from "./Profile";
import { ProxyMode } from "../helper";
import { addProfile } from "../db/profile";

export class ProfileList {
  profiles: Profile[] = [];

  get unfinishedTodoCount() {
    return this.profiles.filter((profile) => !profile.finished).length;
  }
  constructor() {
    makeAutoObservable(this);
  }

  setProfiles(profiles: Profile[]) {
    this.profiles = profiles;
  }

  async addProfile(name: string, type: ProxyMode) {
    const id = await addProfile(name, type);
    const profile = new Profile(id, name, type);
    this.profiles.push(profile);
  }
}
