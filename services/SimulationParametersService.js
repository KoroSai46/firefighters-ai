class SimulationParametersService {

    constructor() {
        if (!SimulationParametersService.instance) {
            this.timeAcceleration = 1;
            this.fireChance = 0.05;
            this.possibleParameters = [
                {parameter: 'timeAcceleration', type: 'number'},
                {parameter: 'fireChance', type: 'number'}
            ]
            SimulationParametersService.instance = this;
        }
        return SimulationParametersService.instance;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new SimulationParametersService();
        }
        return this.instance;
    }

    static setTimeAcceleration(acceleration) {
        this.getInstance().timeAcceleration = acceleration;
    }

    static getTimeAcceleration() {
        return this.getInstance().timeAcceleration;
    }

    static setFireChance(fireChance) {
        this.getInstance().fireChance = fireChance;
    }

    static getFireChance() {
        return this.getInstance().fireChance;
    }

    static setParameter({parameter, value}) {
        // check if the parameter exists
        const possibleParameter = this.getInstance().possibleParameters.find(possibleParameter => possibleParameter.parameter === parameter);
        if (possibleParameter) {
            // check if the value is of the right type
            if (typeof value === possibleParameter.type) {
                this.getInstance()[parameter] = value;
            } else {
                let newValue;
                //try to convert the value to the right type
                if (possibleParameter.type === 'number') {
                    newValue = parseFloat(value);
                    if (!isNaN(newValue)) {
                        this.getInstance()[parameter] = newValue;
                    }
                } else if (possibleParameter.type === 'string') {
                    newValue = value.toString();
                    this.getInstance()[parameter] = newValue;
                }
            }
        }
    }
}

// export the class
module.exports = SimulationParametersService;