var init = (mp, op) => {
    var b = ["#5E9967"];
    var q = [
        ["#994749", "X"],
        ["#2B719A", "O"]
    ];
    var wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    var tw = $(".top-wrapper");
    var b = $("<div/>").addClass("board").appendTo(document.body);
    anime.set(b[0], { translateX: "-50%", translateY: "-50%" });
    var s = new Array(9).fill(true).map((_, i) => {
        var u = $("<div/>").addClass("board-square").appendTo(b).on("click", () => move(i));
        if (i % 3 == 2 && i < 8) $("<br/>").appendTo(b);
        return u;
    });
    var slots = new Array(9).fill(false);
    var pieces = [];
    //$("<div/>").addClass("board-overlay").appendTo(b);
    var rsa = null;
    var rs = () => {
        if (rsa) rsa.pause();
        var pd = [tw.outerHeight() * 2 + 20, 20, 20, 20];
        var wd = $(window);
        var ns = Math.min((wd.width() - (pd[1] + pd[3])) / b.width(), (wd.height() - (pd[0] + pd[2])) / b.height());
        anime.set(b[0], { scale: ns });
    };
    rs();
    setTimeout(() => rs(), 200);
    $(window).on("resize", () => rs());
    var canMove = true;
    var a = (i, p) => {
        var a = q[p];
        var w = s[i].addClass("disabled");
        var u = $("<div/>").addClass("board-piece").html(a[1]).css({ color: a[0] }).appendTo(w);
        pieces[i] = u;
        anime.set(u[0], { translateX: "-50%", translateY: "-50%" });
        anime({
            targets: u[0],
            scale: [0, 1],
            duration: 1000,
            easing: "easeOutElastic"
        });
        canMove = p != mp;
        b[canMove ? "removeClass" : "addClass"]("disabled");
        turn(!canMove);
    };
    var result = (r) => {
        canMove = false;
        b.addClass("disabled");
        console.log(r);
        if (r.r == "tie") displaytt("It\u2019s a tie!", "#FFFFFF"); else {
            displaytt(r.w == mp ? "You win!" : "Opponent wins!", q[r.w][0]);
            r.i.forEach((i) => {
                var c = q[r.w][0];
                s[i].css({ backgroundColor: "".concat(c, c.length == 4 ? "3" : "33") });
                var e = pieces[i];
                anime({
                    targets: e[0],
                    scale: 1.2,
                    easing: "easeInOutQuart",
                    duration: 400,
                    complete: () => {
                        var d = () => {
                            anime({
                                targets: e[0],
                                scale: 1.1,
                                easing: "easeInQuart",
                                duration: 400,
                                complete: () => {
                                    anime({
                                        targets: e[0],
                                        scale: 1.2,
                                        easing: "easeOutQuart",
                                        duration: 400,
                                        complete: () => d()
                                    });
                                }
                            });
                        };
                        d();
                    }
                });
            });
        }
        return true;
    };
    var checkResult = () => {
        var checkP = (i) => {
            return wins.some((w) => w.every((n) => slots[n] === i));
        };
        var zx = checkP(mp) ? mp : checkP(op) ? op : null;
        if (zx != null) return result({ r: "win", w: zx, i: wins.find((w) => w.every((n) => slots[n] === zx)) });
        if (!slots.some((i) => i === false)) return result({ r: "tie" });
    };
    var move = (i) => {
        if (!canMove || slots[i] !== false) return;
        a(i, mp);
        slots[i] = mp;
        var re = i;
        if (checkResult()) return;
        setTimeout(() => {
            /* var availableIndexes = new Array(9).fill(true).map((_, i) => i).filter((i) => slots[i] === false);
            var i = availableIndexes[Math.floor(Math.random() * availableIndexes.length)]; */
            console.log("---");
            var hasUpcomingWin = wins.some((w) => {
                var rn = w.some((n) => slots[n] === mp);
                if (rn) {
                    var rt = w.filter((n) => slots[n] === mp).length;
                    console.log(re, w, rt);
                    if (rt > 1) return rt;
                    else return false;
                }
                return rn;
            });
            var mpwin = new Array(9).fill(true).map((_, i) => i).filter((i) => slots[i] === false);
            //var mpwin = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];;
            if (hasUpcomingWin) {
                console.log("hasUpcomingWin");
                var rq = wins.filter((w) => {
                    var rn = w.some((n) => slots[n] === mp);
                    if (rn) {
                        if (w.some((n) => slots[n] === op)) return false;
                        var rt = w.filter((n) => slots[n] === mp).length;
                        if (rt > 1) return rt;
                    }
                    return false;
                });
                console.log(rq);
                if (rq.length) mpwin = rq[Math.floor(Math.random() * rq.length)];
            }
            var possible = mpwin.filter((n) => slots[n] === false);
            var i = possible[Math.floor(Math.random() * possible.length)];
            a(i, op);
            slots[i] = op;
            checkResult();
        }, 400);
    };
    var displaytt = (t, c) => {
        var tt = $(".top-text");
        anime({
            targets: tt[0],
            translateY: "-150%",
            duration: 200,
            easing: "easeInQuart",
            complete: () => {
                anime({
                    targets: tt.html(t).css({ color: c })[0],
                    translateY: "0%",
                    duration: 200,
                    easing: "easeOutQuart",
                    complete: () => rs()
                });
                rs();
            }
        });
    };
    var turn = (o) => {
        displaytt(o ? "It\u2019s your opponent\u2019s turn!" : "It\u2019s your turn!", q[o ? op : mp][0]);
    };
    turn();
};
var u = Math.floor(Math.random() * 2);
init(u, u ? 0 : 1);