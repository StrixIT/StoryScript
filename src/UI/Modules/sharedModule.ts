import {SafePipe} from "ui/Pipes/sanitizationPipe.ts";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        SafePipe,
        CommonModule,
        FormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        SafePipe
    ]
})

export class SharedModule {}