function Album({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2>Album</h2>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Collection() {
  return (
    <div className="collection">
      <Album title={"album-title-1"} description="description 1" />
      <Album title={"album-title-2"} description="description 2" />
      <Album title={"album-title-3"} description="balalablabla" />
    </div>
  );
}

function Featured() {
  return (
    <div className="featured">
      <h3>Featured</h3>
      <p>Featured content goes here.</p>
    </div>
  );
}
function Browse() {
  return (
    <div className="browse">
      <h3>Browse</h3>
      <p>Browse content goes here.</p>
    </div>
  );
}
function Search() {
  return (
    <div className="search">
      <h3>Search</h3>
      <p>Search content goes here.</p>
    </div>
  );
}

function Vendor() {
  return (
    <div className="vendor">
      <h2>Vendor</h2>
      <Featured />
      <Browse />
      <Search />
    </div>
  );
}
