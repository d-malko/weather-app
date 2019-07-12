import React from 'react';
import { Request } from '../../request';

export class Search extends React.Component {
    componentDidMount() {
        const request = new Request();

        request.get(
            `https://api.unsplash.com/search/photos?page=1&query=${this.props.match.params.queryString}&client_id=942ab6e6acc19e22fb5d3f9c954873294d6709ddadc8d44761ca32a95245390d`,
            (responseJSON) => {
                const response = JSON.parse(responseJSON);
                if (response && response.results) {
                    console.log(response)
                } else {
                    console.error('Response is empty', responseJSON)
                }
            },
            (e) => {
                throw new Error(e);
            }
        )
    }

    render() {

        return <h2>Search page</h2>;
    }
}

export const t = () => {

};

