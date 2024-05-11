export const units: UnitMap = {
    "": { 
      displayName: "Keine",
      abbreviation: ""
    },
    s: { 
      displayName: "Sekunden",
      abbreviation: "s"
    },
    min: { 
      displayName: "Minuten",
      abbreviation: "min"
    },
    h: { 
      displayName: "Stunden",
      abbreviation: "h"
    },
    m: { 
      displayName: "Meter",
      abbreviation: "m"
    },
    km: { 
      displayName: "Kilometer",
      abbreviation: "km"
    },
    l: { 
      displayName: "Liter",
      abbreviation: "L"
    },
    kg: { 
      displayName: "Kilogramm",
      abbreviation: "kg"
    },
    c: { 
      displayName: "Anzahl",
      abbreviation: "Stk"
    }
  };

export interface UnitMap {
    [key: string]: {
      displayName: string;
      abbreviation: string;
    };
  }
  
export interface Activity {
    name: string;
    unit?: string;
    plannedAmount?: number;
    actualAmount?: number;
  }

export interface IWeek {
  [key: string]: Activity[];
}

  export const weekDays: string[] = [
    "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"
  ]