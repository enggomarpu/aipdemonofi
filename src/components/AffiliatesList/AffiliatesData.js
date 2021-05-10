import React, { Component } from "react";
import HttpService from "../../shared/http.service";
import Star from "../../img/star.png";
import { Link } from "react-router-dom";

class AffiliatesData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      results: [],
    };
  }
  async componentDidMount() {
   await HttpService.get("user/all-affiliates")
      .then((res) => {
        this.setState({
          results: res.data,
        });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  render() {
    const { error, results } = this.state;
    if (error) return <div>Error : {error.message}</div>;

    return (
      <>
        {results.map((result) => {
          return (
            <tr key={result.UserId}>
              <td>
                <img src={Star} alt="star" />
              </td>
              <td>
                <span>{result.Name}</span>
              </td>
              <td>{result.CompanyName}</td>
              <td>{result.Address}</td>
              <td>{result.City}</td>
              {/* <td>Active</td> */}
              <td>
              <Link
                      className='d-grid btn btn-secondary'
                      to={`/profile/${result.UserId}`}
                    >
                      View
                </Link>
                {/* <div className="d-grid">
                  <button className="btn btn-secondary">View Detail</button>
                </div> */}
                </td>
            </tr>
          );
        })}
      </>
    );
  }
}

export default AffiliatesData;
