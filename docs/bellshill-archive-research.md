# Bellshill Curling Club — Wayback Archive Research

Source: [Bellshill Curling Club — Scores index (2016 snapshot)](https://web.archive.org/web/20160926082925/http://www.bellshillcurlingclub.com/site/scores_index.html), plus every fixtures/scores page from `bellshillcurlingclub.com/site/*` that the Wayback Machine has captured.

Match target: **Sarah Lean** (three "Lean" family names appear on the site — `Ian Lean`, `Hazel Lean`, `Sarah Lean`).

## Method

1. Queried the Wayback CDX API for every archived page under `bellshillcurlingclub.com/site/*`.
2. Downloaded the latest 200-status snapshot of every `fixtures/` and `scores/` page (71 pages in total, covering seasons 1999-2000 through 2020-2021, though many mid-2010s seasons are missing from the archive).
3. Grepped for `Sarah Lean`, then for each match extracted her team, skip, and — where captured — the final position or bracket result.

## Data completeness caveats

- The 2016 index page you shared only *links* through 2016-17, but the CDX API surfaced additional snapshots up to the 2020-21 season. Where a page was archived later, I used that later snapshot.
- **Not captured for these competitions/seasons** (i.e. no data available at all):
  - Cleland: 2008-09, 2011-12, 2012-13, 2013-14, 2014-15, 2015-16, 2016-17, 2017-18
  - Paterson: 2008-09, 2011-12 through 2017-18
  - Bob Wilson Knock-Out: 2008-09, 2011-12 through 2018-19
  - Pairs / Singles: patchy across all years
- Where a fixtures page was captured before the season finished, the RESULTS block on the page is empty. Those rows are marked "not captured".
- Many score pages don't state a winner explicitly — they show a round-robin table with a `position` row. Position 1 = winner.

## Sarah's confirmed wins found in the archive

**None.**

Across every archived page in which `Sarah Lean` appears, no captured result shows her (or her skip's team) finishing in position 1. The runner-up finishes below are the strongest results found.

Your existing wins (2021-22, 2022-23, 2023-24 Cleland Trophy and 2022-23 Bob Wilson Knock-Out) are **after** the Wayback Machine's last capture of the club site, so they wouldn't be visible here.

## Findings by season

### Cleland Trophy (club round-robin)

| Season | Sarah's role | Skip / team | Captured result | Notes |
|---|---|---|---|---|
| 2005-06 | Skip of Team 4 | Sarah Lean / Alan Turner / Bill McLenachan / Gillian Haggart | Scores page not captured | — |
| 2006-07 | Reserve | — | Winner: Anne Hood; Sarah not on a team | — |
| 2007-08 | Reserve | — | Scores page not captured | — |
| 2009-10 | Reserve | — | Scores page not captured | — |
| 2010-11 | Reserve | — | Scores page not captured | — |
| 2018-19 | Not on roster | — | Winner: Alan Murdoch | Sarah not in this competition |
| 2019-20 | Reserve | — | Winner: Alison Bell (position 1, 3 pts) | — |
| 2020-21 | Not on roster | — | 3-way tie at position 1= (COVID-shortened) | Sarah not in this competition |

### Paterson Trophy (club round-robin)

| Season | Sarah's role | Skip / team | Captured result | Notes |
|---|---|---|---|---|
| 2005-06 | Third(?) in Gillian Haggart's team | Gillian Haggart / Sarah Lean / Alison Turner / Bill McLenachan | Gillian Haggart position **5** of 6 | Not a win |
| 2006-07 | In Iain Buchanan's team | Iain Buchanan / Sarah Lean / Alan Turner / Bill McLenachan | Iain Buchanan position **3** of 6 | Not a win |
| 2007-08 | Skip of Team 6 | Sarah Lean / Anne Hood / Moira Gartshore / Anne Millar | Scores page not captured | — |
| 2009-10 | Skip of Team 1 | Sarah Lean / Anne Hood / Philip Johnston / Richard Wilson | Scores page not captured | — |
| 2010-11 | Skip of Team 3 | Sarah Lean / David Haggart / Catriona Fergus / Alison Bell | Scores page not captured | — |
| 2018-19 | Skip of Team 4 | Sarah Lean / Gillian Haggart / Joyce Cowie / [4th missing] | Sarah position **5** of 5 (2 pts) | Not a win |
| 2019-20 | In John Wilson's team | John Wilson / Sarah Lean / Jonathan Buchanan / Holly Burke | John Wilson position **2** of 5 (**runner-up**, 4 pts) | Possible runner-up credit |
| 2020-21 | Skip of Team 4 | Sarah Lean / Alison Bell / Stewart Carson / [4th missing] | Scores page not captured | — |

### Bob Wilson Knock-Out Cup (bracket)

| Season | Sarah's role | Skip / team | Captured result | Notes |
|---|---|---|---|---|
| 2005-06 | Reserve | — | Winner: Team 3 (Iain Buchanan), decided on ends won (5-3) | — |
| 2006-07 | In Gillian Haggart's team | Gillian Haggart / Peter Cleland / Sarah Lean / Joyce Cowie | Final: David Haggart 10, Gillian Haggart 9 — Gillian **runner-up** | Possible runner-up credit |
| 2007-08 | In Gillian Haggart's team | Gillian Haggart / Sarah Lean / Kay Hamilton / Joyce Cowie | Gillian lost SF to David Haggart 6-7; final unclear from snapshot | Semi-finalist |
| 2009-10 | Sub 3rd in Iain Buchanan's team (for Alison Turner) | Iain Buchanan / Sarah Lean (sub) / John Adkin / Alison Bell | Iain Buchanan won SF 7-5 vs Andy Williamson; final result ambiguous in snapshot (Jim McCoull 10 also shown) | Cross-check needed for final |
| 2010-11 | Skip of Team 2 | Sarah Lean / Gillian Haggart / Alison Turner / — | SF: Sarah 6, Iain Buchanan 5 (**Sarah wins SF**). Final: Sarah 6, Andy Williamson 8 — Sarah **runner-up** | Strongest confirmed placing found |
| 2019-20 | In Alan Turner's team | Alan Turner / Sarah Lean / Jan Wilson / Tom Russell | Bracket populated, no result scores in snapshot | — |
| 2020-21 | In Iain Buchanan's team | Iain Buchanan / Sarah Lean / Jan Wilson / Emma Campbell | Bracket populated, no result scores in snapshot | — |

### Invitational (inter-club, single-day bonspiel)

| Season | Sarah's role | Skip / team | Captured result | Notes |
|---|---|---|---|---|
| 2004-05 | In Iain Buchanan's team | Iain Buchanan / Sarah Lean / Carol Marsh / Ian Lean | Results not populated in snapshot | — |
| 2005-06 | In Gillian Haggart's team | Gillian Haggart / Sarah Lean / Fiona Johnston / Philip Johnston | Results not populated in snapshot | — |
| 2006-07 | In Jim McCoull's team | Jim McCoull / Sarah Lean / Carol Marsh / Andy Muir | Only top place populated | — |
| 2007-08 | In Iain Buchanan's team | Iain Buchanan / Sarah Lean / Alison Bell / Peter Cleland | Bellshill 1 (GH) position 8; Iain's team not tagged in results — likely a reserve rink | — |
| 2009-10 | Skip of Bellshill 2 (SL) | Sarah Lean / Douglas Wright / Gillian Haggart / [4th missing] | Position **4** of 8 (won by Lanarkshire Young Curlers) | — |
| 2010-11 | Skip of Bellshill 4 | Sarah Lean / Douglas Wright / John Adkin / Tom Russell | Results not populated in snapshot | — |
| 2019-20 | Skip of Bellshill 1 (SL) | Sarah Lean / Gillian Haggart / John Adkin / Alison Bell | Results not populated in snapshot | — |

### Pairs / Singles

Sarah **does not appear** in any archived pairs or singles fixtures pages (0506-1011, 1819-2021). The "Lean" hits in those pages are Ian and Hazel Lean.

### Christmas fixtures (fun rink names, not competitive)

Sarah appears once, on the "Star" rink in **2002-03** with Kris Paterson and William Houston — recorded here for completeness, not as a competition result.

## Cross-reference checklist for your list

Confirmed (from the archive) as **not** wins by Sarah:

- 2005-06 Paterson — position 5 (Gillian Haggart's team)
- 2006-07 Paterson — position 3 (Iain Buchanan's team)
- 2018-19 Paterson — position 5 (Sarah skip)
- 2018-19 Cleland — Sarah not entered
- 2019-20 Cleland — Sarah reserve only, winner Alison Bell
- 2020-21 Cleland — Sarah not entered

Possible **runner-up** credits worth verifying with the club:

- 2006-07 Bob Wilson Knock-Out — final 9-10 loss (Sarah in Gillian Haggart's team)
- 2010-11 Bob Wilson Knock-Out — final 6-8 loss (Sarah skip)
- 2019-20 Paterson Trophy — position 2 (Sarah in John Wilson's team)

**Ambiguous** and needing a look at the physical trophy or club records:

- 2007-08 Bob Wilson Knock-Out (Sarah in a semi-finalist team)
- 2009-10 Bob Wilson Knock-Out (Sarah subbed for Iain Buchanan's team, which reached the final)
- Any Paterson / Cleland / KO season between 2011-12 and 2017-18 (no archived pages)

## Suggested next steps

- Ask the club secretary for a complete honours list — the archive gaps 2011-12 through 2017-18 are the most likely place for missing wins.
- If you can locate a printed prize list from the 2011-2016 club dinners, we can add those with confidence.
