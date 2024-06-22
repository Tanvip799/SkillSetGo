import moment from "moment";
import Calendar from "./CalendarTemplate";
import { Link } from "react-router-dom";
import { Tooltip } from "@nextui-org/react";

const events = [
  {
    title: "Python Webscraping Workshop",
    start: moment("2024-06-22T10:00:00").toDate(),
    end: moment("2024-06-22T11:00:00").toDate(),
  },
  {
    title: "Machine Learning Workshop",
    start: moment("2024-06-24T12:00:00").toDate(),
    end: moment("2024-06-26T14:00:00").toDate(),
  },
];

const components = {
  event: (props) => {
    const { title, start, end } = props.event;
    const startDate = moment(start).format('MMMM Do YYYY, h:mm a');
    const endDate = moment(end).format('MMMM Do YYYY, h:mm a');

    return (
      <Link to="">
        <Tooltip className="border border-gray-300"
          content={
            <div className="p-1">
              <p className="font-semibold">{title}</p>
              <p>{startDate} - {endDate}</p>
            </div>
          }
        >
          <div
            style={{
              backgroundColor: "#06b6d4",
              fontFamily: "Montserrat",
              fontWeight: "500",
              color: "white",
              padding: "5px",
              borderRadius: "5px",
              cursor: "pointer",
              height: "100%",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                width: "100%",
                textAlign: "center",
              }}
            >
              {title}
            </div>
          </div>
        </Tooltip>
      </Link>
    );
  },
};

export default function CalendarComponent() {
  return (
    <Calendar
      events={events}
      defaultView={"month"}
      views={["month","week", "day"]}
      components={components}
    />
  );
}

