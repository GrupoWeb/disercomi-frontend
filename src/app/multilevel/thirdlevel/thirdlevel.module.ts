import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThirdlevelRoutingModule } from './thirdlevel-routing.module';
import { Third1Component } from './third1/third1.component';
import { ComponentsModule } from '@shared/components/components.module';

@NgModule({
    imports: [CommonModule, ThirdlevelRoutingModule, ComponentsModule, Third1Component],
})
export class ThirdlevelModule {}
