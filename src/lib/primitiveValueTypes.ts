declare const NumberBrand: unique symbol;
declare const StringBrand: unique symbol;
declare const BooleanBrand: unique symbol;
declare const DateBrand: unique symbol;
declare const SymbolBrand: unique symbol;

export type NumberPath = typeof NumberBrand;
export type StringPath = typeof StringBrand;
export type BooleanPath = typeof BooleanBrand;
export type DatePath = typeof DateBrand;
export type SymbolPath = typeof SymbolBrand;
