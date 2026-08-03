
class Renderer {

    render() {

        throw new Error(

            `${this.constructor.name} must implement render().`

        );

    }

}

export default Renderer;