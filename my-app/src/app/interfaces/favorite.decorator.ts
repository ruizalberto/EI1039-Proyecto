export function Favorite(){
    return function (target: any, propertyKey: string){
        let value: boolean = false;
        
        const getter = function(){
            return value;
        };
        const setter = function (newValue:boolean){
            value = newValue;
        };

        Object.defineProperty(target, propertyKey,{
            get: getter,
            set: setter,
            enumerable: true,
        });
    }

}