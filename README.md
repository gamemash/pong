Server software using immutable and a diff based structure
========================================================

The idea is to use a diff based structure to manage all the changes to objects.
Say a game of pong with 2 bars.
A player can create new diffs at when changing direction for its bar.
The server will receive the diff with the corrosponding timestamp and go back in time to the diff and reapply towards to correct position.
The other player will receive diffs from the server and do the same as the server.



How to use
----------

###Diff

to create a diff:
```
let diff = Diff.generate(before, after)
```

you can then apply the diff again:

```
let after = Diff.apply(before, diff);
let before = Diff.apply(after, diff);
```

###Repo
Require repo and diff.
A repo is a list of diffs.
When using a repo you can quickly move forward and backwards in time:

```
let repo = Repo.create();
repo = repo.push(Diff.generate(before, after));
let objectInPast   = Repo.reverseTime(object, repo, timestamp_in_past);
let objectInFuture = Repo.forwardTime(object, repository, timestamp_in_future);
```

WIP
----


