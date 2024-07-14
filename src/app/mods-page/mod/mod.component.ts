import { Component, inject, input, computed } from '@angular/core';
import { ModsService } from '../mods.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { NexusMod } from '../../core/nexus-mods';

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

  mod = computed<NexusMod | undefined>(() => this.modQuery.data());
  isLoading = computed<boolean>(() => this.modQuery.isLoading());

  gameName = computed<string>(() => {
    switch (this.domainName()) {
      case 'cyberpunk2077':
        return 'Cyberpunk 2077';
      case 'witcher3':
        return 'The Witcher 3';
      case 'witcher2':
        return 'The Witcher 2';
    }

    return '';
  });
}
