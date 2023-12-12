export interface RouteStrategy{
    getPreference(): string;
}

export class FastestRouteStrategy implements RouteStrategy {
    getPreference(): string {
      return 'fastest';
    }
}

export class ShortestRouteStrategy implements RouteStrategy {
    getPreference(): string {
        return 'shortest';
    }
}

export class RecommendedRouteStrategy implements RouteStrategy {
    getPreference(): string {
        return 'recommended';
    }
}