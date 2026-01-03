 

# this parameter

```TypeScript
class Male {
  private name: string;
 
  public constructor(name: string) {
    this.name = name;
  }
 
  public toString(): string {
    return `Monsieur ${this.name}`;
  }
}
 
class Female {
  private name: string;
 
  public constructor(name: string) {
    this.name = name;
  }
 
  public toString(this: Female): string {
    return `Madame ${this.name}`;
  }
}
```