# Contributing

## Commit format:
````
    DA-#GH_ISSUE: Message.
    
    The message describes what the patch changes in single sentence and imperative.
    Imagine if you are having a new bug and scroll through the log history and
    some commits say 'backup' and 'some changes'. This doesn't help you to understand
    what was changed and how did somebody change that. Additionally you don't
    want to scroll through 5 commits for one small feature.

    So the first line is a real life imperative statement with DA for 'DiscAnno'
    and a GitHub issue #. The body describes the behavior without the patch, why 
    this is a problem, and how the patch fixes the problem when applied.
    
    This should be one single commit. If you committed in the meantime and want to
    squash your commits, do this:
    git commit --soft RESET~<Num> && git commit -m "DA-#GH_ISSUE: ..."
    'Num' determines the number of commits you want to squash. !Be careful! and don't
    squash merges!
````

## Additional Resources

* [Issues](https://github.com/annefried/discanno/issues)

## Contributors

* [Nicklas Linz](https://github.com/NicklasLinz)
* [Timo Gühring](https://github.com/JeannedArk)
