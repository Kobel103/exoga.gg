import { EntityTypeEnum } from './enums/entity-type-enum';

export class SearchRequest {
  constructor(filter: Filter) {
    this.filter = filter;
  }

  view?: SearchRequestViewEnum = SearchRequestViewEnum.List;
  filter: Filter;
  paging?: Paging;
  ordering?: Ordering[];
}

export class Filter {
  constructor(
    id: number,
    title: string,
    entityType: EntityTypeEnum,
    isPredefined: boolean,
    searchText: string,
    conditions: FilterCondition[],
    itemsCount: number
  ) {
    this.id = id;
    this.title = title;
    this.entityType = entityType;
    this.isPredefined = isPredefined;
    this.searchText = searchText;
    this.conditions = conditions;
    this.itemsCount = itemsCount;
  }

  id: number;
  title: string;
  entityType: EntityTypeEnum;
  isPredefined: boolean;
  searchText: string;
  conditions: FilterCondition[];
  itemsCount: number;
}

export class FilterCondition {
  constructor(field: string, operator: FilterConditionOperatorEnum, fieldType: FieldTypeEnum, value: any) {
    this.field = field;
    this.operator = operator;
    this.fieldType = fieldType;
    this.value = value;
  }

  field: string;
  operator: FilterConditionOperatorEnum;
  fieldType: FieldTypeEnum;
  value: any;
}

export enum FieldTypeEnum {
  Undefined = 0,
  String = 1,
  Number = 2,
  Date = 3,
  Boolean = 4,
  Enum = 5
}

export enum FilterConditionOperatorEnum {
  Equal = 1,
  NotEqual = 2,
  GreaterThan = 3,
  GreaterThanOrEqual = 4,
  LessThan = 5,
  LessThanOrEqual = 6,
  Contains = 7,
  NotContains = 8,
  StartsWith = 9,
  EndsWith = 10,
  IsEmpty = 11,
  IsNotEmpty = 12
}

export class Paging {
  constructor(take: number, skip: number) {
    this.take = take;
    this.skip = skip;
  }

  take?: number;
  skip?: number;
}

export class Ordering {
  fieldName?: string;
  direction?: OrderDirection;
}

export enum OrderDirection {
  Asc = 0,
  Desc = 1
}
export enum SearchRequestViewEnum {
  List = 'List',
  Autocomplete = 'Autocomplete'
}
