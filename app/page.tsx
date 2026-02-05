export default function Home() {
  return (
    <main className="space-y-12">
      <section>
        <p className="text-xl">Welcome.</p>
        <hr className="mt-4" />
      </section>

      <section className="grid md:grid-cols-2 gap-12">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Who is this guy?</h1>
          <p>
            I am <a className="underline" href="http://www.alexeichner.com/">Alex Eichner</a>.
          </p>
          <p>
            I work at <a className="underline" href="https://www.bookandstreet.com/">Book+Street</a> as the Systems and Operations Analyst.
          </p>
          <p>
            I can <a className="underline" href="https://www.sporcle.com/games/g/world">name every country</a> in less than 10 minutes.
          </p>
          <p>
            I watch a decent amount of <a className="underline" href="https://letterboxd.com/ace27/">movies</a>.
          </p>
          <p>I like watching youtube videos about niche topics.</p>
          <p>I am an avid hiker and love rock climbing.</p>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">What everyone else is saying.</h1>
          <p><a className="underline" href="https://alumnimagazine.osu.edu/story/elite-eight-meet-faces-time-and-change">Elite Eight: Meet the faces of time and change</a></p>
          <p><a className="underline" href="https://alumnimagazine.osu.edu/story/scholarship-helps-students-stay">This scholarship helps students stay at Ohio State</a></p>
          <p><a className="underline" href="https://nbc24.com/whats-going-on/southview-high-school-seniors-helping-beautify-environment-with-clean-up-419-club">Southview High School Seniors Helping Beautify Environment</a></p>
          <p><a className="underline" href="https://sylvaniaadvantage.com/2022/10/03/clean-up-419-beautifies-sylvania/">Clean Up 419 Beautifies Sylvania</a></p>
        </div>
      </section>
    </main>
  );
}
