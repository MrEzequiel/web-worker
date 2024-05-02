import { Controller } from "./controller";
import { Service } from "./service";
import { View } from "./view";


const worker = new Worker('./src/worker.ts', { 
  type: 'module' // type module only work in google chrome
});


Controller.init({
  service: new Service(),
  view: new View(),
  worker,
})