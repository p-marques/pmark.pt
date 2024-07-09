import { Component, inject, input } from '@angular/core';
import { ModsService } from '../mods.service';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-mod',
  standalone: true,
  imports: [],
  templateUrl: './mod.component.html',
  styleUrl: './mod.component.scss',
})
export class ModComponent {
  private modsService = inject(ModsService);

  domainName = input.required<string>();
  modId = input.required<number>();

  modQuery = injectQuery(() => ({
    queryKey: [`mod-${this.domainName()}-${this.modId()}`],
    queryFn: () =>
      this.modsService.getModDetails(this.domainName(), this.modId()),
  }));
}
