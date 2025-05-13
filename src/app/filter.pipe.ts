import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, key: string): any[] {
    if (!items || !searchText) return items;

    searchText = searchText.toLowerCase();
    return items.filter(item => item[key]?.toLowerCase().includes(searchText));
  }
}
