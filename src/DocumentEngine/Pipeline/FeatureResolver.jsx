class FeatureResolver {

    resolve(config = {}) {

        return {

            ...(config.features ?? {})

        };

    }

}

export default new FeatureResolver();