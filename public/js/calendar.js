var Calendars = (() => {
  class DateRange {
    constructor(start, end) {
      this.start = start;
      this.end = end;
    }
    union(other) {
      if (this.start > other.start) {
        this.start = other.start;
      }
      if (this.end < other.end) {
        this.end = other.end;
      }
      return this;
    }
    intersection(other) {
      if (this.start < other.start) {
        this.start = other.start;
      }
      if (this.end > other.end) {
        this.end = other.end;
      }
      return this;
    }
    date_in(date) {
      return this.start <= date && date <= this.end;
    }
  }

  function update_calendar(cal, date) {
    cal.find(".month").text(date.toLocaleString("default", { month: "long" }));
    cal.find(".year").text(date.toLocaleString("default", { year: "numeric" }));
    let start_of_month = new Date(date);
    start_of_month.setDate(1);
    cal.find(".day").each(function () {
      let day = $(this);
      let n = day.data("day") - start_of_month.getDay();
      let local_date = new Date(start_of_month);
      local_date.setDate(n);
      day.data("date", local_date);
      if (local_date.getMonth() != start_of_month.getMonth()) {
        day.addClass("text-muted");
      } else {
        day.removeClass("text-muted");
      }
      day.text(local_date.getDate());
      day.parent().removeClass("bg-secondary");
    });
    cal.find(".year-btn").each(function () {
      let y = $(this);
      y.text(date.getFullYear() + +y.data("year"));
    });
    start_of_month.setDate(-start_of_month.getDay() + 1);
    let end_of_range = new Date(start_of_month);
    end_of_range.setDate(start_of_month.getDate() + 6 * 7 - 1);
    cal.data("range", new DateRange(start_of_month, end_of_range));
  }

  function update_selection(cal, start, end, starting) {
    let swapped = false;
    if (end < start) {
      let tmp = end;
      end = start;
      start = tmp;
      starting = !starting;
      swapped = true;
    }
    let days = cal
      .find(".day");
    days.parent().removeClass("bg-secondary");
    days.each(function () {
        let day = $(this);
        let n = day.data("date");
        if (start <= n && n <= end) {
          if (day.hasClass("bg-danger")) {
            if(starting) {
              end = new Date(n);
              end.setDate(n.getDate() - 1);
            } else {
              start = new Date(n);
              start.setDate(n.getDate() + 1);
              days.parent().removeClass("bg-secondary");
            }
          } else {
            day.parent().addClass("bg-secondary");
          }
        }
      });
    cal.find("input.cal_form_start").val(start.toISOString().split("T")[0]);
    cal.find("input.cal_form_end").val(end.toISOString().split("T")[0]);
    if (swapped) {
      let tmp = end;
      end = start;
      start = tmp;
    }
    cal.data("start", start);
    cal.data("end", end);
  }

  function day_target(e) {
    let target = $(e.target);
    if (target.hasClass("day")) {
      return target;
    } else {
      return target.find(".day");
    }
  }

  function block_dates(cal, dates) {
    cal.find(".day").each(function () {
      let day = $(this);
      let date = day.data("date");
      day.removeClass("bg-danger");
      for (let d of dates) {
        if (d.date_in(date)) {
          day.addClass("bg-danger");
          break;
        }
      }
    });
  }

  var ret = {
    DateRange: DateRange,
    date_fn: {},
    // name: id, date_fn: (DateRange, callback: ([DateRange]) -> void) -> void
    block_dates: function (name, date_fn) {
      this.date_fn[name] = date_fn;
      let cal = this.calendars.filter('[name="' + name + '"]');
      if (cal.length > 0) {
        date_fn(cal.data("range"), block_dates.bind(null, cal));
      } else {
        console.log("Calendar " + name + " not found");
      }
    },
  };

  ret.calendars = $("div.calendar").each(function () {
    let cal = $(this);
    let date = cal.data("date");
    if (date == "today") {
      date = new Date();
    } else {
      date = new Date(date);
    }
    cal.data("date", date);
    cal.data("start", date);
    cal.data("end", date);
    update_calendar(cal, date);
    cal.find(".previous").click(
      function (_e) {
        date.setMonth(date.getMonth() - 1);
        update_calendar(cal, date);
        update_selection(cal, cal.data("start"), cal.data("end"));
        let fn = this.date_fn[cal.attr("name")];
        if (fn) fn(cal.data("range"), block_dates.bind(null, cal));
      }.bind(ret)
    );
    cal.find(".next").click(
      function (_e) {
        date.setMonth(date.getMonth() + 1);
        update_calendar(cal, date);
        update_selection(cal, cal.data("start"), cal.data("end"));
        let fn = this.date_fn[cal.attr("name")];
        if (fn) fn(cal.data("range"), block_dates.bind(null, cal));
      }.bind(ret)
    );
    cal.find(".month-btn").click(
      function (_e) {
        date.setMonth($(_e.target).data("month"));
        update_calendar(cal, date);
        update_selection(cal, cal.data("start"), cal.data("end"));
        let fn = this.date_fn[cal.attr("name")];
        if (fn) fn(cal.data("range"), block_dates.bind(null, cal));
      }.bind(ret)
    );
    cal.find(".year-btn").click(
      function (_e) {
        date.setFullYear(date.getFullYear() + +$(_e.target).data("year"));
        update_calendar(cal, date);
        update_selection(cal, cal.data("start"), cal.data("end"));
        let fn = this.date_fn[cal.attr("name")];
        if (fn) fn(cal.data("range"), block_dates.bind(null, cal));
      }.bind(ret)
    );

    cal
      .find(".day")
      .parent()
      .on("dragend", function (e) {
        e.preventDefault();
        //start = undefined;
      })
      .on("dragstart", function (e) {
        let day = day_target(e);
        if (!day.hasClass("bg-danger")) {
          cal.data("start", day.data("date"));
        }
      })
      .on("dragenter", function (e) {
        let day = day_target(e);
        if (!day.hasClass("bg-danger")) {
          e.preventDefault();
          update_selection(cal, cal.data("start"), day.data("date"));
        }
      })
      .on("dragover", function (e) {
        let day = day_target(e);
        if (!day.hasClass("bg-danger")) {
          e.preventDefault();
        }
      })
      .on("drop", function (e) {
        let day = day_target(e);
        if (!day.hasClass("bg-danger")) {
          e.preventDefault();
          let end = day.data("date");
          update_selection(cal, cal.data("start"), end, true);
        }
      })
      .on("click", function (e) {
        let day = day_target(e);
        if (!day.hasClass("bg-danger")) {
          //let start = cal.data("start");
          //let end = cal.data("end");
          let new_date = day.data("date");

          //let cur = cal.data("cur");
          let start = new_date;
          let end = cal.data("start");
          //cal.data("end", );
          update_selection(cal, start, end, true);
        }
      });
  });

  return ret;
})();

Calendars.block_dates("reserve_date", (range, callback) => {
  range.start.setDate(range.start.getDate() + 4);
  range.end.setMonth(range.start.getMonth());
  range.end.setDate(range.start.getDate() + 7);
  callback([new Calendars.DateRange(range.start, range.end)]);
});
