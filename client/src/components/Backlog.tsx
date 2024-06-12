import List from "./List";

function Backlog() {
  return (
    <div className="d-flex justify-content-start gap-3">
      {[
        { title: "Backlog", games: [] },
        { title: "Playing", games: [] },
        { title: "Done", games: [] },
      ].map((element) => (
        <List key={element.title} title={element.title} games={element.games} />
      ))}
    </div>
  );
}

export default Backlog;
