# World Cup Tracker

Family-friendly fixtures, news, and predictions tracker for the 2026 World Cup.
UK times, BBC/ITV viewing badges, real schedule from Football-Data.org, predictions game, sticker book, goal-celebration confetti.

Live at: https://worldcupchart.vercel.app

## Tech

- Next.js 15 + Tailwind CSS, deployed on Vercel
- Real fixtures from [Football-Data.org](https://www.football-data.org) with rate-limit-aware fetching
- Aggregated news from BBC Sport, Sky Sports, Guardian Football, FIFA RSS
- Wikipedia summaries for host cities
- Per-device localStorage for predictions and stickers

## Run locally

```bash
npm install
echo "FOOTBALL_DATA_TOKEN=your_token_here" > .env.local
npm run dev
```

## Routes

- `/` home with countdown, today's matches, group preview
- `/fixtures` all 104 matches, filterable by stage / group / team / UK broadcaster
- `/groups/[A-L]` group standings + matches
- `/knockout` horizontal bracket
- `/teams/[CODE]` per-team fixture list
- `/cities` host cities with hover Wikipedia cards
- `/match/[id]` live polling, kickoff countdown, BBC/ITV, goal-celebrate confetti
- `/news` aggregated UK and global headlines
- `/predictions` family game with group winners, finalists, champion, golden boot
- `/stickers` collectible team sticker book

## License / IP

This is a non-commercial family project. Editorial use of the FIFA emblem and
schedule per FIFA's IP guidelines for media. Player photos and team crests are
linked, not rehosted.
