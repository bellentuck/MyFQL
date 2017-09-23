## About

The goal here is to build a JavaScript class called FQL that will be a pure JavaScript implementation of a (minimal) SQL-esque database management system and query language.  By working on this exercise, you will get a chance to explore how the inner workings of a database engine can work.

## Getting started

Fork and clone this repo, then `npm install`. If you're having an issue regarding your python version, see the [note below](#ptyhon-version-issue). 

Run the tests with `npm test`. This should open (in a web browser) an auto-reloading html file that reports on the specs passing / failing. If you have any `console.log`s in your source code, they'll show up in the terminal where you ran `npm test` and also in the browser at the top of the document (under the header for **Console Output**) but *not* in the browser console.

IMPORTANT: There are three files where you should be writing code: `source/table.js`, `source/plan.js`, and `source/fql.js`.

At the start, all but the first spec is pending, as specified by `xit`. As you work through the specs, change those `xit`s to `it`s. Work on these exercises and continue switching off each exercise with your pairing partner.

## Guidance

The role of `Table` instances is to handle the persistence. In this case that means dealing with the file system, because each table will be a folder where each of its rows is stored in a json file. A `Table` instance also exposes a `.read` method for `FQL` queries to utilize.

The role of `FQL` instances is to build up a multi-faceted query for a particular table and then return an array of the results when executed with `.get`. Essentially a query object contains information about *what to do later*. Only during `.get` will this information be applied to *actually running* the query. It does so by using its table's `.read` and `.getRowIds` methods.

The role of `Plan` instances is to simplify the role of queries. Each query should have a plan that contains all of the infromation the query should "remember" for later (when it executes). The plan is also responsible for abstracting some of what a query needs to do when executed. For example, it has `.withinLimit` method that returns whether or not a possible result is still within the plan's stored limit.

## Python version issue

You may need to downgrade from python 3 to python 2. You could do that by locating the path to your python 2 installation (if you've got it installed somewhere) and manually editing your `.bash_profile` (or `.bashrc` in linux) to include that in your `$PATH` as [this stackoverflow post suggests](https://stackoverflow.com/a/15285703/1470694). Here's an example of what we put at the end of our `.bash_profile` that fixed this (in OSX):

```sh
# Setting the PATH for Python 2.7
export PATH="/Library/Frameworks/Python.framework/Versions/2.7/bin:${PATH}"
```

You might also consider installing a ptyhon version manager like `pyenv` ([install and other instructions here](https://github.com/pyenv/pyenv#installation)). With `pyenv` installed you should be able to `pyenv install 2.7.13` then `pyenv global 2.7.13`.

If on Mac OSX you run into issues installing python versions with `pyenv` you may need to first install Xcode Command Line Tools, see [here](http://railsapps.github.io/xcode-command-line-tools.html) for more.

Even if python versions install correctly, you may run into a problem when setting the global python version, e.g. `pyenv global 2.7.13`, where afterwards if you do `python --version` it does not print `2.7.13`. If this is the case, try adding the following to the end of your .bash_profile (or .bashrc in linux), as suggested by [this github issue comment](https://github.com/pyenv/pyenv/issues/185#issuecomment-50762043):

```sh
export PYENV_ROOT=~/.pyenv
export PATH=$PYENV_ROOT/shims:$PATH
```
