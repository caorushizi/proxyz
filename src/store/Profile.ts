import { makeAutoObservable } from "mobx";
import { ProxyMode } from "../helper";

export class Profile {
  id = 0;
  name = "";
  type: ProxyMode;
  finished = false;

  constructor(id: number, name: string, type: ProxyMode) {
    makeAutoObservable(this);
    this.name = name;
    this.type = type;
    this.id = id;
  }

  toggle() {
    this.finished = !this.finished;
  }
}
