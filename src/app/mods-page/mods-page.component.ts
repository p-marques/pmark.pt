import { Component, inject, computed } from '@angular/core';
import { ModsService } from './mods.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ModComponent } from "./mod/mod.component";

@Component({
  selector: 'app-mods-page',
  standalone: true,
  imports: [ModComponent],
  templateUrl: './mods-page.component.html',
  styleUrl: './mods-page.component.scss',
})
export class ModsPageComponent {
  private modsService = inject(ModsService);

  modsCollectionDbQuery = injectQuery(() => ({
    queryKey: ['mods-collection-db'],
    queryFn: () => this.modsService.getModCollectionDb(),
  }));

  modsCollection = computed(() => this.modsCollectionDbQuery.data() ?? []);
}
