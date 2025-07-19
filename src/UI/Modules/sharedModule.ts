import {SafePipe} from "ui/Pipes/sanitizationPipe.ts";
import {NgModule} from "@angular/core";
import {NgClass, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        NgClass,
        NgStyle,
        FormsModule,
        SafePipe
    ],
    exports: [
        NgClass,
        NgStyle,
        FormsModule,
        SafePipe
    ]
})

export class SharedModule {}