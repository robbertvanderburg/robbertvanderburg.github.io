# Production deployment

GitHub Pages publishes the root of the `main` branch through the Pages build and deployment workflow. The production URL is [robbertvanderburg.github.io](https://robbertvanderburg.github.io/). Production uses the repository’s default GitHub Pages domain with HTTPS enforcement. The scheduled publication workflow updates the Semantic Scholar bibliography on `main`.

## Production backup from 26 November 2026

| Item | Reference |
| --- | --- |
| Legacy `origin/main` and last successful live deployment | `0592a04e5bae268e0f8cd3c14af75734b3619e3e` |
| Archive branch | [archive/legacy-production-2026-11-26](https://github.com/robbertvanderburg/robbertvanderburg.github.io/tree/archive/legacy-production-2026-11-26) |
| Annotated backup tag | [legacy-production-2026-11-26](https://github.com/robbertvanderburg/robbertvanderburg.github.io/tree/legacy-production-2026-11-26) |
| Last successful legacy Pages run | [Pages build and deployment](https://github.com/robbertvanderburg/robbertvanderburg.github.io/actions/runs/44796918622) |
| Source branch for the migration | [guidovibecoding](https://github.com/robbertvanderburg/robbertvanderburg.github.io/tree/guidovibecoding) at `c9652f49b6c07a5bee04e46bb96fbbc70fdc2942` |

The legacy branch, the peeled annotated tag and the successful Pages deployment all point to the same commit. Keep the archive branch, annotated tag and source branch on GitHub.

## Restore the original production website

Use a fresh clone in a separate directory. These commands create a rollback commit on top of current `main` with the exact legacy tree.

```sh
git clone https://github.com/robbertvanderburg/robbertvanderburg.github.io.git robbert-site-rollback
cd robbert-site-rollback
git fetch origin --tags
git switch -c "rollback/legacy-production-$(date +%Y%m%d-%H%M%S)" origin/main

legacy=0592a04e5bae268e0f8cd3c14af75734b3619e3e
test "$(git rev-parse 'legacy-production-2026-11-26^{commit}')" = "$legacy" || exit 1
test "$(git rev-parse origin/archive/legacy-production-2026-11-26)" = "$legacy" || exit 1

git restore --source="$legacy" --staged --worktree -- :/
test "$(git write-tree)" = "$(git rev-parse "${legacy}^{tree}")" || exit 1
git diff --cached --stat
git commit -m "rollback: restore legacy production website"
```

If branch rules allow direct publication, run `git push origin HEAD:refs/heads/main`. If a pull request is required, run `git push -u origin HEAD` and merge a pull request into `main` under the active rules. If `main` advances first, prepare the rollback again from the new tip.

In [Actions](https://github.com/robbertvanderburg/robbertvanderburg.github.io/actions), wait for the Pages deployment for the rollback commit to succeed. Open the production URL and check HTTPS, the homepage, `/publications/`, `/news/`, `/cv/`, and the linked slides. The restored files are identical to the archived site. The migration and its documentation stay available in Git history.
