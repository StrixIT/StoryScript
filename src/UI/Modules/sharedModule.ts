import {NgModule} from "@angular/core";
import {NgClass, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        NgClass,
        NgStyle,
        FormsModule
    ],
    exports: [
        NgClass,
        NgStyle,
        FormsModule
    ]
})

export class SharedModule {}